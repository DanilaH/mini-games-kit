#!/usr/bin/env python3
"""Small-studio analysis helper: Wilson CI and planning N for two proportions.

Uses Python standard library only. Not a replacement for a statistical analysis
plan; the power approximation assumes independent users, equal allocation,
two-sided z-test and no multiple-testing/cluster adjustment.

Examples:
    python stats_reference.py --wilson 0 14
    python stats_reference.py --wilson 1 26
    python stats_reference.py --power 0.20 0.25
    python stats_reference.py --examples
"""
import argparse
import math
from statistics import NormalDist


def wilson(successes: int, total: int, confidence: float = 0.95) -> tuple[float, float]:
    if total < 1 or not 0 <= successes <= total:
        raise ValueError("Require total >= 1 and 0 <= successes <= total")
    if not 0 < confidence < 1:
        raise ValueError("Confidence must be inside (0, 1)")
    z = NormalDist().inv_cdf((1 + confidence) / 2)
    p = successes / total
    d = 1 + z * z / total
    midpoint = (p + z * z / (2 * total)) / d
    half = z / d * math.sqrt(p * (1 - p) / total + z * z / (4 * total * total))
    return max(0.0, midpoint - half), min(1.0, midpoint + half)


def two_proportion_n(p0: float, p1: float, alpha: float = 0.05, power: float = 0.80) -> int:
    if not 0 < p0 < 1 or not 0 < p1 < 1 or p0 == p1:
        raise ValueError("Require distinct proportions inside (0, 1)")
    if not 0 < alpha < 1 or not 0 < power < 1:
        raise ValueError("alpha/power must be inside (0, 1)")
    z_alpha = NormalDist().inv_cdf(1 - alpha / 2)
    z_beta = NormalDist().inv_cdf(power)
    avg = (p0 + p1) / 2
    variance_null = 2 * avg * (1 - avg)
    variance_alt = p0 * (1 - p0) + p1 * (1 - p1)
    n = (z_alpha * math.sqrt(variance_null) + z_beta * math.sqrt(variance_alt)) ** 2 / (p1 - p0) ** 2
    return math.ceil(n)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    group = p.add_mutually_exclusive_group()
    group.add_argument("--wilson", nargs=2, metavar=("SUCCESSES", "N"), type=int)
    group.add_argument("--power", nargs=2, metavar=("P_BASELINE", "P_TREATMENT"), type=float)
    group.add_argument("--examples", action="store_true")
    p.add_argument("--confidence", type=float, default=0.95)
    p.add_argument("--alpha", type=float, default=0.05)
    p.add_argument("--target-power", type=float, default=0.80)
    args = p.parse_args()
    if args.wilson:
        x, n = args.wilson
        lo, hi = wilson(x, n, args.confidence)
        print(f"Observed: {x}/{n} = {x/n:.4%}; Wilson {args.confidence:.0%} CI: [{lo:.2%}, {hi:.2%}]")
    elif args.power:
        p0, p1 = args.power
        n = two_proportion_n(p0, p1, args.alpha, args.target_power)
        print(f"A {p0:.1%} -> B {p1:.1%}: ~{n:,} independent users / arm, ~{2*n:,} total")
        print(f"Assumptions: alpha={args.alpha}; power={args.target_power}, independent users, fixed horizon, no extra corrections")
    else:
        for x, n in [(0, 14), (1, 26), (17, 29)]:
            lo, hi = wilson(x, n)
            print(f"Wilson {x}/{n}: [{lo:.2%}, {hi:.2%}]")
        for pa, pb in [(0.10, 0.15), (0.20, 0.25), (0.20, 0.30), (0.10, 0.12)]:
            n = two_proportion_n(pa, pb)
            print(f"Power {pa:.0%}->{pb:.0%}: {n} / group")


if __name__ == "__main__":
    main()
