const validateUser = (user) => {
    let errors = [];
    if(!exists(user.geschlecht) || !user.geschlecht.match(/^[MWA]{1}$/g)){
      errors.push("geschlecht");
    }
    if(!exists(user.vorname) || !user.vorname.match(/^[\w\s]+$/g)){
      errors.push("vorname");
    }
    if(!exists(user.nachname) || !user.nachname.match(/^[\w\s]+$/g)){
      errors.push("nachname")
    }
    if(!exists(user.email) || !user.email.match(/^.+@.+\..+$/g)){
      errors.push("email");
    }
    if(!exists(user.passwort) || !user.passwort.match(/^[a-zA-Z0-9.!_\-+?]{10,}$/g)){
      errors.push("passwort");
    }
    if(!exists(user.tel) || !user.tel.match(/^[0-9]{10}$/g)){
      errors.push("tel");
    }
    return errors;
}

const validateReservation = (reservation) => {
  let errors = [];
  console.log(reservation.datum);
  if(!exists(reservation.datum) || !reservation.datum.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g)){
    errors.push("datum");
  }
  if(!exists(reservation.uhrzeit) || !reservation.uhrzeit.match(/^[0-9]{2}:[0-9]{2}$/g)){
    errors.push("uhrzeit");
  }
  if(!exists(reservation.dauer) || !reservation.dauer.match(/^empty|15m|30m|45m|60m|mehr$/g)){
    errors.push("dauer");
  }
  if(!exists(reservation.nachricht) || !reservation.nachricht.match(/^.{0,250}$/g)){
    errors.push("nachricht");
  }
  return errors;
}

const exists = value => {
    return value !== null && typeof value !== 'undefined';
}

module.exports = {validateUser, validateReservation};