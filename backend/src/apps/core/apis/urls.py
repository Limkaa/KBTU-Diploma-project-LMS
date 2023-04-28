from ..utils.apis import APIConfig

from ..modules import *

modules = [
    APIConfig(awards.urls_path, True)
]

urlpatterns = [module.connect() for module in modules]