import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import numpy as np
from pixelforge.models import ORGANIC
from pixelforge.organic import render_sheet, DIRS

for name, build in ORGANIC.items():
    sp = render_sheet(build(), ppu=2)
    assert set(sp) == set(DIRS), name
    assert len({v.size for v in sp.values()}) == 1, name + ": same size"
    a = {k: np.array(v) for k, v in sp.items()}
    assert not np.array_equal(a["S"], a["N"]), name + ": front != back"
    assert not np.array_equal(a["E"], a["W"]), name + ": E != W"
    cols = {tuple(p[:3]) for p in a["S"].reshape(-1, 4) if p[3]}
    assert len(cols) < 80, name + f": palette stays small ({len(cols)})"
print("Tudo OK")
