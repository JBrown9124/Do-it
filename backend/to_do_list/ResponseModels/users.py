class UsersResponseModel:
    def __init__(self):
        self.user_id = None
        self.user_display_name = None
        self.user_email = None
    def __repr__(self):
        f"{self.user_id} :{self.user_display} : {self.user_email}"