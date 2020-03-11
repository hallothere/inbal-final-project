const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres://postgres:postgres@localhost:5432/users`
);

exports.addRegister = function(first, last, email, password) {
    // console.log("addRegister is working");
    return db.query(
        `INSERT INTO users (first, last, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id`,
        [first, last, email, password]
    );
};

exports.getPass = function(email) {
    return db.query(`SELECT password, id FROM users WHERE email = $1`, [email]);
};

exports.compareEmail = function(email) {
    return db.query(`SELECT email FROM users WHERE email = $1`, [email]);
};
// exports.compareCode = function() {
//     return db.query(
//         `SELECT * FROM password_reset_codes WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`
//     );
// };

exports.insertCode = function(email, code) {
    return db.query(
        `INSERT INTO password_reset_codes (email, code)
      VALUES ($1, $2)
      RETURNING id`,
        [email, code]
    );
};

exports.getCode = function(email) {
    return db.query(
        `SELECT code FROM password_reset_codes WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' AND email = $1`,
        [email]
    );
};

exports.getUserDetails = function(id) {
    return db
        .query(`SELECT * FROM users WHERE id = $1`, [id])
        .then(({ rows }) => rows);
};

exports.getLastUsers = function() {
    return db
        .query(
            `SELECT * FROM users ORDER BY id DESC LIMIT 3
`
        )
        .then(({ rows }) => rows);
};

exports.getMatchingUsers = function(val) {
    return db
        .query(`SELECT * FROM users WHERE first ILIKE $1 OR last ILIKE $1;`, [
            val + "%"
        ])
        .then(({ rows }) => rows);
};

exports.updatePass = function(password, email) {
    return db.query(
        `UPDATE users SET password=$1 WHERE email=$2 RETURNING id`,
        [password, email]
    );
};

exports.insertURL = function(filename, s3Url, id) {
    return db.query(
        `UPDATE users SET url=$1 WHERE id=$2
    RETURNING url, id`,
        [s3Url + filename, id]
    );
};

exports.insertBio = function(bio, id) {
    return db.query(
        `UPDATE users SET bio=$1 WHERE id=$2
    RETURNING bio, id`,
        [bio, id]
    );
};

exports.checkRelationship = function(userId, receiverId) {
    return db
        .query(
            `SELECT * FROM friendships
          WHERE (receiver_id = $1 AND sender_id = $2)
          OR (receiver_id = $2 AND sender_id = $1)`,
            [userId, receiverId]
        )
        .then(({ rows }) => rows);
};

exports.deleteRelationship = function(userId, receiverId) {
    return db.query(
        `DELETE FROM friendships
          WHERE (receiver_id = $1 AND sender_id = $2)
          OR (receiver_id = $2 AND sender_id = $1)`,
        [userId, receiverId]
    );
};

exports.insertRelationship = function(userId, receiverId) {
    return db
        .query(
            `INSERT INTO friendships (sender_id, receiver_id)
          VALUES ($1, $2)
          RETURNING id`,
            [userId, receiverId]
        )
        .then(({ rows }) => rows);
};

exports.updateRelationship = function(senderId, receiverId) {
    return db
        .query(
            `UPDATE friendships SET accepted=true WHERE sender_id=$1 AND receiver_id=$2 
          RETURNING id`,
            [senderId, receiverId]
        )
        .then(({ rows }) => rows);
};

// `UPDATE friendships SET accepted=true WHERE sender_id=$1 AND receiver_id=$2 OR WHERE sender_id=$2 AND receiver_id=$1
// RETURNING id`,

// `UPDATE users SET bio=$1 WHERE id=$2
// RETURNING bio, id`,
// [bio, id]

// exports.updateNoPass = function(first, last, email, userId) {
//     return db.query(
//         `UPDATE users SET first=$1, last=$2, email=$3 WHERE id=$4`,
//         [first, last, email, userId]
//     );
// };

//SELECT * FROM my_table
// WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes';
