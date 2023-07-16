// const { default: axios } = require("axios");

// const login = async (req, res) => {
//   const url = "http://localhost:3000/users";
//   const { username, password } = req.body;
//   try {
//     const respond = await axios.get(`${url}`, {
//       params: {
//         username: username,
//       },
//     });
//     // console.log(respond.data);
//     const user = respond.data[0];
//     if (!user) {
//       res.status(401).json({ error: "not a member, please register" });
//     }
//     if (user.username !== username) {
//       res.status(401).json({ error: "invalid username" });
//     }
//     res.status(200).json({ message: "Login Success" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Login error" });
//   }
// };

// module.exports = login;
