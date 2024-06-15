export const EmailValidator = (email) => {
    const pattern =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return pattern.test(email);
};
export const SignupValidator = (email, phone, name, password, cpassword) => {
    if (email) {
        if (EmailValidator(email)) {
            if (name) {
                if (phone) {
                    if (password) {
                        if (cpassword) {
                            if (password == cpassword) {
                                return "Signup success!!";
                            } else {
                                return "Passwords Are Not Matching";
                            }
                        } else {
                            return "Enter Confirm Password";
                        }
                    } else {
                        return "Enter Password";
                    }
                } else {
                    return "Enter Phone";
                }
            } else {
                return "Enter Name";
            }
        } else {
            return "Enter Valid Email";
        }
    } else {
        return "Enter Email";
    }
};