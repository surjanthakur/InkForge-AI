from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()


# to hash password
def pass_hash(plain_pass):
    return password_hash.hash(plain_pass)


# to verify passwords
def verify_password(plain_pass, hash_pass):
    return password_hash.verify(password=plain_pass, hash=hash_pass)
