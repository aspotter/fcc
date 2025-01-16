import hashlib

def crack_sha1_hash(hash, use_salts = False):
    # open password and salt files and convert to lists
    passwords_file = open("top-10000-passwords.txt", "r") 
    data = passwords_file.read() 
    passwords = data.split("\n")
    passwords_file.close()

    salts_file = open("known-salts.txt", "r") 
    data2 = salts_file.read() 
    salts = data2.split("\n")
    salts_file.close() 

    for password in passwords:
        if use_salts:
            for salt in salts:
                salt_password = salt + password
                password_salt = password + salt
                sp = hashlib.sha1(salt_password.encode()).hexdigest()
                ps = hashlib.sha1(password_salt.encode()).hexdigest()
                if hash == sp or hash == ps:    
                    return password
        else:
            h = hashlib.sha1(password.encode()).hexdigest()
            if hash == h:    
                return password

    return 'PASSWORD NOT IN DATABASE'