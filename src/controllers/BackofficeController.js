const BackofficeService = require("../service/BackofficeService");

const loginPost = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token } = await BackofficeService.loginUserBackoffice(
      email,
      password
    );
    res.set("Authorization", `Bearer ${token}`);
    res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const signupFrontPost = async (req, res) => {
  const data = req.body;
  try {
    const result = await BackofficeService.signupFrontOffice(data);
    res.status(200).json({ ...result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const accceptSignupFrontPost = async (req, res) => {
  const data = req.body;
  try {
    const result = await BackofficeService.acceptSignupFrontOffice(data);
    res.status(200).json({ ...result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const loginFrontPost = async (req, res) => {
  const { email, password, image } = req.body;

  try {
    const data = await BackofficeService.loginFrontkoffice(
      email,
      password,
      image
    );

    //res.set("Authorization", `Bearer ${token}`);
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getMemberWithEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const { data } = await BackofficeService.getMemberWithEmail(email);
    res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getUrlFileApp = async (req, res) => {
  //const file = req.file;

  try {
    const result = await BackofficeService.getUrlFile();
    res.status(200).json({ token: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { data } = await BackofficeService.updateUser(req.body);
    res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const olivierCarteController = async (req, res) => {
  try {
    const { data } = await BackofficeService.olivierCarte(req, res);
    res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  loginPost,
  signupFrontPost,
  accceptSignupFrontPost,
  loginFrontPost,
  getMemberWithEmail,
  getUrlFileApp,
  updateUser,
  olivierCarteController,
};
