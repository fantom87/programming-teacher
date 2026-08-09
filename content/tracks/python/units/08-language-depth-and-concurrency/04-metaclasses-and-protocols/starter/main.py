from typing import Protocol, runtime_checkable

# 1. Exporter — a @runtime_checkable Protocol with one method:
#      def export(self) -> str: ...

# 2. Registry — a metaclass (subclass of type):
#      plugins = {}
#      __new__(mcls, name, bases, ns) builds the class with super(),
#      and if ns.get("format") is truthy, stores it:
#      Registry.plugins[cls.format] = cls

# 3. The plugin family:
#      class Plugin(metaclass=Registry): format = None
#      class JsonExporter(Plugin): format = "json"; export -> "{...}"
#      class CsvExporter(Plugin):  format = "csv";  export -> "a,b"

# 4. Print the table and the two isinstance results:
#      for name in sorted(Registry.plugins): "name: ClassName"
#      isinstance(JsonExporter(), Exporter), isinstance("hello", Exporter)
