"""Independent placement verification of public Block Blast evidence fixtures.

This original verifier uses sets of (row, column) coordinates, enumerates every
unplayed piece and translated position, and clears rows/columns simultaneously.
It does not execute game code, access the network, or authenticate the author's
runtime capture. Download/unpack the cited evidence separately; it is not vendored.

Usage:
  python3 blockblast_independent_solver.py --android /path/block-blast-evidence \
      --ios-live /path/block-blast-ios-live --output /tmp/placement-results.json
"""

import argparse
import hashlib
import itertools
import json
from collections import Counter
from pathlib import Path


SIDE = 8
LINES = tuple(frozenset((r, c) for c in range(SIDE)) for r in range(SIDE)) + tuple(
    frozenset((r, c) for r in range(SIDE)) for c in range(SIDE)
)


def place_and_clear(board, cells):
    occupied = board | cells
    completed = [line for line in LINES if line <= occupied]
    return occupied - frozenset().union(*completed), len(completed)


def positions(shape):
    height = max(r for r, _ in shape) + 1
    width = max(c for _, c in shape) + 1
    return tuple(
        (r, c, frozenset((r + dr, c + dc) for dr, dc in shape))
        for r in range(SIDE - height + 1)
        for c in range(SIDE - width + 1)
    )


def search(board, pieces, first_only=False):
    choices = {pid: positions(shape) for pid, shape in pieces.items()}
    initial = {
        pid: sum(not (board & cells) for _, _, cells in candidates)
        for pid, candidates in choices.items()
    }
    nodes, orders = Counter(), Counter()
    first_solution = None

    def visit(current, remaining, trace):
        nonlocal first_solution
        nodes[len(trace)] += 1
        if not remaining:
            orders[tuple(move[0] for move in trace)] += 1
            if first_solution is None:
                first_solution = trace
            return first_only
        for pid in remaining:
            for row, col, cells in choices[pid]:
                if current & cells:
                    continue
                after, clears = place_and_clear(current, cells)
                if visit(
                    after,
                    tuple(other for other in remaining if other != pid),
                    trace + ((pid, row, col, clears),),
                ):
                    return True
        return False

    visit(board, tuple(pieces), ())
    return {
        "initial_legal_positions": initial,
        "nodes_by_depth": dict(nodes),
        "recursion_nodes_including_root": sum(nodes.values()),
        "legal_transitions": sum(nodes.values()) - 1,
        "complete_solutions": sum(orders.values()),
        "solutions_by_order": {
            ",".join(map(str, order)): orders[order]
            for order in itertools.permutations(pieces)
        },
        "first_solution": first_solution,
    }


def fixed_order_attempts(board, pieces):
    """Separately count repeated prefixes to match the author's count convention."""
    result = {}
    for order in itertools.permutations(pieces):
        attempts = 0

        def visit(current, depth):
            nonlocal attempts
            if depth == len(order):
                return
            for _, _, cells in positions(pieces[order[depth]]):
                if current & cells:
                    continue
                attempts += 1
                after, _ = place_and_clear(current, cells)
                visit(after, depth + 1)

        visit(board, 0)
        result[",".join(map(str, order))] = attempts
    return {"per_order": result, "total": sum(result.values())}


def read_json(path):
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--android", type=Path, required=True)
    parser.add_argument("--ios-live", type=Path, required=True)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    android, android_hash = read_json(args.android / "proof/unsolvable-witness.json")
    ios, ios_hash = read_json(args.ios_live / "impossible-hand.json")
    a_board = frozenset(
        (r, c) for r, row in enumerate(android["board_rows"])
        for c, cell in enumerate(row) if cell == "#"
    )
    a_shapes = {
        pid: frozenset(
            (r, c) for r, bits in enumerate(android["shape_rows"][str(pid)])
            for c in range(bits.bit_length()) if bits & (1 << c)
        ) for pid in android["pieces"]
    }
    i_board = frozenset(
        (r, c) for r, row in enumerate(ios["board"])
        for c, cell in enumerate(row) if cell != -1
    )
    i_shapes = {
        pid: frozenset(
            (r, c) for r, row in enumerate(ios["shapes"][pid - 1])
            for c, cell in enumerate(row) if cell
        ) for pid in ios["hand"]
    }
    # One missing crossing cell completes both lines; clear from the same snapshot.
    crossing = frozenset([(0, c) for c in range(1, 8)] + [(r, 0) for r in range(1, 8)])
    assert place_and_clear(crossing, frozenset([(0, 0)])) == (frozenset(), 2)
    result = {
        "method": "Independent exhaustive coordinate-set search",
        "rules": {
            "board": "8x8", "rotation": False, "extra_powers": False,
            "all_piece_orders": True, "all_legal_positions": True,
            "simultaneous_row_column_clears": True,
        },
        "simultaneous_clear_control": True,
        "limits": [
            "Checks supplied board and geometry only; no game or ad SDK executed.",
            "Android fixture is synthetic; iOS fixture is an author-supplied capture.",
            "Does not authenticate decoding, runtime capture, prevalence, or current deployment.",
        ],
        "fixtures": {},
    }
    for name, board, shapes, digest in [
        ("android_synthetic", a_board, a_shapes, android_hash),
        ("ios_author_capture", i_board, i_shapes, ios_hash),
    ]:
        assert len(shapes) == 3  # These fixtures contain three distinct IDs.
        actual = search(board, shapes)
        control = search(frozenset(), shapes, first_only=True)
        assert actual["complete_solutions"] == 0
        assert control["complete_solutions"] > 0
        result["fixtures"][name] = {
            "input_sha256": digest, "occupied_cells": len(board),
            "piece_ids": list(shapes), "result": actual,
            "fixed_order_placement_attempts": fixed_order_attempts(board, shapes),
            "empty_board_positive_control": control["first_solution"],
        }
    output = json.dumps(result, indent=2) + "\n"
    if args.output:
        args.output.write_text(output)
    print(output, end="")


if __name__ == "__main__":
    main()
