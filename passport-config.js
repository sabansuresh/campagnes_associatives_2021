const LocalStrategy = require('passport-local').Strategy

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: 'Aucune utilisateur avec cet Email' })
    }

    try {
      if (password==user.password) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Mauvais Mot de Passe' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.ID))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize