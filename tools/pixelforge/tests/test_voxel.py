import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import numpy as np
from pixelforge.models import MODELS
from pixelforge.voxel import render_sheet, DIRS

for name, boxes in MODELS.items():
    sp = render_sheet(boxes)
    assert set(sp) == set(DIRS), name
    assert not np.array_equal(np.array(sp["S"]), np.array(sp["N"])), name + ": front differs from back"
sp = render_sheet(MODELS["police"])
assert set(sp) == set(DIRS) and len({v.size for v in sp.values()}) == 1, "8 same-size dirs"
arrs = {k: np.array(v) for k, v in sp.items()}
assert not np.array_equal(arrs["S"], arrs["N"]), "front differs from back"
assert not np.array_equal(arrs["E"], arrs["W"]), "E differs from W"
assert all((a[..., 3] > 0).any() for a in arrs.values()), "non-empty"
print("Tudo OK")
