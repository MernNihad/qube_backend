

// Custom validation functions
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateName = (name) => {
    const nameRegex = /^[a-zA-Z0-9 ]{3,}$/;
    return nameRegex.test(name);
};

export const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
};
export const validatePassword = (password) => {
    
// At least one lowercase letter ((?=.*[a-z])).
// At least one uppercase letter ((?=.*[A-Z])).
// At least one digit ((?=.*\d)).
// At least one special character ((?=.*[^a-zA-Z\d\s])).
// There is no specific minimum length requirement (.* matches any length).

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).*$/;
    return passwordRegex.test(password);
};


// https://www.regextester.com/ testing site online












//  // validateEmail(email);
//  if (validateEmail(email) && validateName(name) && validatePhoneNumber(phoneNumber) && validatePassword(password)) {

//     // Validate password (at least 8 characters)
//     if (password.length < 8) {

        

//     }else{

//         return next(createError(400, "Password must be at least 8 characters long"))

//     }

// } else {
//     // At least one validation failed, return an error message
//     res.status(400).json({ message: 'Invalid input. Please check your email, name, and phone number.' });
// }