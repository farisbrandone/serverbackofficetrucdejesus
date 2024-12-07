const BackofficeService = require("../service/BackofficeService");

const loginPost = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token } = await BackofficeService.loginUserBackoffice(
      email,
      password
    );
    res.set("Authorization", `Bearer ${token}`);
    res.status(200).send({ token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { loginPost };
