function validatePW(pw){
     //Validating password
     //const pwRegex = /?=[a-z]?=[A-Z])?=[0-9]/
    const pwRegex = [
        /[a-z]/,
        /[A-Z]/,
        /[0-9]/
    ];

    //Cause if not meet length req, I don't care bout characteres in it.
    var valid = true;
    for (var i = 0; i < pwRegex.length && valid; ++i){
        valid = pwRegex[i].test(pw);
    }

    if (valid){
        valid = pw.length > 6;
    }
     
     return valid;

}

module.exports = {
    testPW:(pw) => {return validatePW(pw);}
};