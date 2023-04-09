
class ResponseDetails:
    map = {}
    
    def add_field_message(self, key: str, message: str = "", override=True):
        if override or key not in self.map:
            self.map[key] = message
        return self.map
    
    def clear(self):
        self.map = {}

