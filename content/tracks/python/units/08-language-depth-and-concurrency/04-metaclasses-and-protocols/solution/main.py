from typing import Protocol, runtime_checkable


@runtime_checkable
class Exporter(Protocol):
    def export(self) -> str: ...


class Registry(type):
    plugins = {}

    def __new__(mcls, name, bases, ns):
        cls = super().__new__(mcls, name, bases, ns)
        if ns.get("format"):
            Registry.plugins[cls.format] = cls
        return cls


class Plugin(metaclass=Registry):
    format = None


class JsonExporter(Plugin):
    format = "json"

    def export(self):
        return "{...}"


class CsvExporter(Plugin):
    format = "csv"

    def export(self):
        return "a,b"


for name in sorted(Registry.plugins):
    print(f"{name}: {Registry.plugins[name].__name__}")
print(isinstance(JsonExporter(), Exporter))
print(isinstance("hello", Exporter))
