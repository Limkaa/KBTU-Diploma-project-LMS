from django.urls import path, include, URLResolver


class APIConfig():
    def __init__(self,
        urls_path = None,
        active = True,
        route = '',
        namespace = '',
    ) -> None:
        self.route = route
        self.urls_path = urls_path
        self.namespace = namespace
        self.active = active
    
    def get_path(self) -> URLResolver:
        return path(self.route, include(self.urls_path, self.namespace))
    
    def connect(self):
        if self.active:
            return self.get_path()
        
