<h1 align="center"/>Marzneshin</h1>

<p align="center">
    A Scalable and Comprehensive Proxy Engine management panel.
</p>

<br/>
<p align="center">
    <a href="https://github.com/BrotherHugo/marzneshin/actions/workflows/ci.yml">
        <img src="https://github.com/BrotherHugo/marzneshin/actions/workflows/ci.yml/badge.svg" />
    </a>
    <a href="https://hub.docker.com/r/brotherhugo/marznode" target="_blank">
        <img src="https://img.shields.io/docker/v/brotherhugo/marznode/v0.1.0?label=marznode&logo=docker" />
    </a>
    <br>
    <a href="#">
        <img src="https://img.shields.io/github/license/BrotherHugo/marzneshin?style=flat-square" />
    </a>
</p>

<p align="center">
  <a href="https://github.com/marzneshin/marzneshin" target="_blank" rel="noopener noreferrer" >
    <img src="https://github.com/marzneshin/marzneshin/raw/master/docs/assets/Desktop-full.png" alt="screenshots" width="600" height="auto">
  </a>
</p>

## Table of Contents

- [BrotherHugo / Evenlights](#brotherhugo--evenlights)
- [Overview](#overview)
  - [Docs](#docs)
  - [Features](#features)
  - [Supported Languages](#supported-languages)
- [Marznode](#marznode)
- [Donation](#donation)
- [License](#license)
- [Contributors](#contributors)

# BrotherHugo / Evenlights

Это форк [Marzneshin](https://github.com/marzneshin/marzneshin) организации **BrotherHugo** для панели Evenlights: VLESS+Reality, подписки sing-box, учёт трафика, свои Docker-образы вместо заброшенных `dawsh/*`.

Текущая работа — [docs/exec-plans/active/modernize-evenlights-panel.md](docs/exec-plans/active/modernize-evenlights-panel.md). Карта репозитория для агентов и разработчиков — [AGENTS.md](AGENTS.md).

# Overview

Marzneshin is a censorship circumvention tool utilizing other censorship circumvention tools.

Marzneshin controls the [Marznodes](https://github.com/marzneshin/marznode)
connected to it; monitoring/disabling/enabling users on marznode instances while
marznode manages and interacts with vpn backends (such as xray).

### Docs

Marzneshin documentation may be found [here](https://docs.marzneshin.org).

### Features

- **Web UI** Dashboard
- **Multi Nodes** support for traffic distribution, scalability, and fault tolerance
- Supports protocols **Vmess**, **VLESS**, **Trojan** and **Shadowsocks** as provided by xray
- **Multi-protocol** for a single user
- Manage users' access to inbounds separately using **services**
- **Multi-user** on a single inbound
- Limit users' data and set exire dates
- Reset traffic periodically (daily, weekly,...)
- **Subscription link** compatible with **V2ray** (e.g. V2RayNG, OneClick, Nekoray, etc.), **Clash** and **ClashMeta**
- Automated **Share link** and **QRcode** generator
- System, nodes, traffic statistics, users monitoring
- Integrated **Command Line Interface (CLI)**
- [**Multi-admin** support](https://github.com/marzneshin/marzneshin/issues/73) (WIP)
- Marzneshin is decoupled from VPN backends
- Resilient and fault tolerant node management

**Deployment and Developer Kit:**

- REST-full API
- Kubernetes and multiple deployment strategy and options (WIP)

### Supported Languages

- Russian (WIP)
- English
- Kurdish (Soranî, Kurmancî)
- Persian
- Arabic
- Simplified Chinese

# marznode

[marznode](https://github.com/marzneshin/marznode) is the backend needed to run proxy servers.

# Donation

If you found Marzneshin useful and would like to support its development, you can make a donation in one of the
following crypto networks:

- Bitcoin network: 13ZDhE5KHGsfjM4A22eLTUgW98WpXhQTuF
- TRON network (TRC20): TYxFCiRqJ3SiV6rAQAmJUd3DgVmJvEAfz4
- TON network: EQB_VYiU73U1_wk-01I_MLg9-hx953VOf9Y36t2Z04WyUapD

Part of the donations would be tipped to contributors, the rest to collaborators.

May developers be rich.

# License

Published under [AGPL-3.0](./LICENSE).

# Contributors

We ❤️‍🔥 contributors! If you'd like to contribute, please check out our [Contributing Guidelines](https://docs.marzneshin.org/docs/contribution-guideline) and
feel free to submit a pull request or open an issue. We also welcome you to join
our [Telegram](https://t.me/marzneshins) group for either support or contributing guidance.

Check [open issues](https://github.com/marzneshin/marzneshin/issues) to help the progress of this project.

<p align="center">
Thanks to all contributors who have helped Marzneshin:
</p>
<p align="center">
<a href="https://github.com/marzneshin/marzneshin/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=marzneshin/marzneshin" />
</a>
</p>
<p align="center">
  Made with <a rel="noopener noreferrer" target="_blank" href="https://contrib.rocks">contrib.rocks</a>
</p>
