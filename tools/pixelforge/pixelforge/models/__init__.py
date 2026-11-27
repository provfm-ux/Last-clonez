from . import police, knight, zombie

# blocky legacy box models
MODELS = {"police": police.BOXES, "knight": knight.BOXES}
# organic ellipsoid models (build() -> Scene)
ORGANIC = {"zombie": zombie.build}
