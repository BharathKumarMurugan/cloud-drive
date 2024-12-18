/**
 * Create Account -> Flow
 * 1. user enters full name and email
 * 2. check if user already exists using the email
 * 3. send OTP to user's email
 * 4. this will send a secret key for creating a session. 
 * 5. create a new user document if the user is a new user.
 * 6. return the user's accountId that will be used to complete the logic
 * 7. verify OTP and authenticate to login
 */

// const createAccount = async ()