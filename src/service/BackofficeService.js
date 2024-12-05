const jwt = require("jsonwebtoken");

class BackofficeService {
  static async loginUserBackoffice(email, password) {
    let role = "";
    try {
      if (email === process.env.EMAIL || password === process.env.PASSWORD) {
        role = "superAdmin";
        //récupération des données du super admin dans la base de donn&es client
        //et transfert au token
        const token = jwt.sign({ userEmail: email }, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });
        return { token };
      }
      //ici vérification si la personne est dans la base de données client
    } catch (error) {
      throw new Error("La connection à échouer");
    }
  }
}

module.exports = BackofficeService;
