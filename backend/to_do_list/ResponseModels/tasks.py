class TasksResponseModel:
    def __init__(self):
        
        self.task_id = None
        self.tasks = []
    def __repr__(self):
        return f"{self.task_id}:{self.tasks}"
        