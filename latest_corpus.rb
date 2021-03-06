WARNING_HEADER =
  "" "
// THIS INTERFACE WAS AUTO GENERATED ON #{Date.today}
// DO NOT EDIT THIS FILE.
// IT WILL BE OVERWRITTEN ON EVERY CELERYSCRIPT UPGRADE.

" ""
HASH = Sequence::Corpus.as_json({})
OUTPUT = [WARNING_HEADER]
FILE_PATH = "latest_corpus.ts"
VALUES = HASH.fetch(:values)
VALUE_PREFIX = "CS"
VALUES_TPL = "export type %{name} = %{type};\n"
VALUES_OVERRIDE = HashWithIndifferentAccess.new(float: "number", integer: "number")
# There are some rule exceptions when generating the Typescript corpus.
FUNNY_NAMES = { "Example" => "CSExample" }
ENUMS = HASH.fetch(:enums)
ENUM_TPL = "export type %{name} = %{type};\n"
ARGS = HASH
  .fetch(:args)
  .reduce(HashWithIndifferentAccess.new) do |acc, arg|
  acc[arg.fetch("name").to_s] = arg
  acc
end
NODES = HASH.fetch(:nodes)
NODE_START = ["export type %{camel_case}BodyItem = %{body_types};",
              "/** %{snake_case}\n%{docs}\n %{tag_docs} */",
              "export interface %{camel_case} {",
              "  comment?: string | undefined;",
              '  kind: "%{snake_case}";',
              "  args: {"].join("\n")
MIDDLE_CENTER = "    %{arg_name}: %{arg_values};"
BOTTOM_END = ["  }",
              "  body?: %{camel_case}BodyItem[] | undefined;",
              "}\n"].join("\n")
CONSTANT_DECLR_HACK = {
  LATEST_VERSION: Sequence::LATEST_VERSION,
  DIGITAL: CeleryScriptSettingsBag::DIGITAL,
  ANALOG: CeleryScriptSettingsBag::ANALOG,
}
CONSTANT_DECLR_HACK_TPL = "export const %{name} = %{value};\n"
PUBLIC_NODES = [] # Filled at runtime
PIPE = " |\n"

def emit_constants()
  CONSTANT_DECLR_HACK.map do |(name, value)|
    konst = CONSTANT_DECLR_HACK_TPL % { name: name, value: value }
    add_to_output(konst)
  end
end

def add_to_output(string)
  OUTPUT.push(string)
end

def save!
  File.open(FILE_PATH, "w") { |f| f.write(OUTPUT.join("")) }
  puts "Saved to #{FILE_PATH}"
end

def name_of(thing)
  thing.fetch("name").to_s
end

def emit_values
  output = VALUES.map do |val|
    real_name = name_of(val)
    capitalized = real_name.capitalize
    celerized = VALUE_PREFIX + capitalized
    FUNNY_NAMES[capitalized] = celerized
    type = VALUES_OVERRIDE.fetch(real_name, real_name)
    VALUES_TPL % { name: celerized, type: type }
  end
    .uniq
    .sort
  add_to_output(output)
end

def emit_enums
  output = ENUMS.map do |enum|
    name = name_of(enum)
    type = enum.fetch("allowed_values").sort.map(&:inspect).uniq.join(PIPE)
    FUNNY_NAMES[name] = name
    ENUM_TPL % { name: name, type: type }
  end
    .uniq
    .sort

  add_to_output(output)
end

def emit_nodes()
  nodes = NODES.map do |node|
    tags = node.fetch("tags").sort.uniq
    # Don't publish internal CeleryScript nodes:
    next if tags.include?(:private)
    tag_list = tags.join(", ")
    name = name_of(node).to_s
    bodies = node
      .fetch("allowed_body_types")
      .sort
      .uniq
      .map(&:to_s)
      .map(&:camelize)
    bt = bodies.any? ? "(#{bodies.join(PIPE)})" : "never"
    PUBLIC_NODES.push(name.camelize)
    tpl_binding = {
      body_types: bt,
      camel_case: name.camelize,
      docs: node.fetch("docs"),
      snake_case: name,
      tag_docs: "Tag properties: #{tag_list}.",
    }

    one = NODE_START % tpl_binding
    two = node.fetch("allowed_args").sort.map do |arg|
      MIDDLE_CENTER % {
        arg_name: arg.to_s,
        arg_values: ARGS.fetch(arg)
          .fetch("allowed_values")
          .map(&:name)
          .map { |x| FUNNY_NAMES[x] || x.camelize }
          .join(PIPE),
      }
    end
    three = BOTTOM_END % tpl_binding
    [one, two, three].flatten.join("\n")
  end
    .compact
    .uniq
    .join("\n")
  add_to_output(nodes)
end

def emit_misc()
  types = PUBLIC_NODES.sort.uniq.join(PIPE)
  tpl = "export type CeleryNode = #{types};\n"
  add_to_output(tpl)
end

emit_constants()
emit_values()
emit_enums()
emit_nodes()
emit_misc()
save!
