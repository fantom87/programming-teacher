def t_registry_filled_itself():
    assert Registry.plugins.get("json") is JsonExporter, "defining JsonExporter should have registered it under 'json'"
    assert Registry.plugins.get("csv") is CsvExporter, "defining CsvExporter should have registered it under 'csv'"
    assert None not in Registry.plugins and "" not in Registry.plugins, "the Plugin base (format=None) must not be registered"

def t_new_plugin_registers_automatically():
    class XmlExporter(Plugin):
        format = "xml"
        def export(self):
            return "<x/>"
    assert Registry.plugins.get("xml") is XmlExporter, "a brand-new subclass should register itself — that's the metaclass's job"

def t_metaclass_wired_in():
    assert isinstance(JsonExporter, Registry), "JsonExporter should be built BY Registry — type(JsonExporter) is Registry"
    assert issubclass(Registry, type), "Registry must subclass type to be a metaclass"

def t_protocol_checks_shape():
    assert isinstance(JsonExporter(), Exporter), "JsonExporter has export(), so it satisfies the protocol"
    assert not isinstance("hello", Exporter), "a str has no export() — the protocol should reject it"
    class Stranger:
        def export(self):
            return "?"
    assert isinstance(Stranger(), Exporter), "protocols check shape, not ancestry — Stranger never inherits from Exporter"

test("the registry filled itself at class-definition time", t_registry_filled_itself)
test("new subclasses register with zero extra code", t_new_plugin_registers_automatically)
test("Registry is the metaclass of the plugins", t_metaclass_wired_in)
test("Exporter is structural: shape in, ancestry out", t_protocol_checks_shape)
