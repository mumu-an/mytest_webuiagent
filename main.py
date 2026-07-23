from playwright.async_api import async_playwright
from app.chrome_utils.fingerprint_utils import generate_random_fingerprint

import asyncio
import ctypes
import json
import os


class Chrome:
    def __init__(self, user_name="user_data"):
        base_dir = os.getcwd()

        self.BASE_CONFIG_DIR = os.path.join(base_dir, "app", "config", user_name)
        self.USER_DATA_DIR = os.path.join(self.BASE_CONFIG_DIR, "user_data")
        self.PROFILE_PATH = os.path.join(self.BASE_CONFIG_DIR, "profile.json")
        self.CHROME_PATH = os.path.join(base_dir, "app", "fingerprint_browser", "chrome.exe")

        os.makedirs(self.USER_DATA_DIR, exist_ok=True)
        os.makedirs(self.BASE_CONFIG_DIR, exist_ok=True)

        self.playwright = None

    def load_profile(self):
        if os.path.exists(self.PROFILE_PATH):
            with open(self.PROFILE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)

        w = ctypes.windll.user32.GetSystemMetrics(0)
        h = ctypes.windll.user32.GetSystemMetrics(1)

        base_fp = generate_random_fingerprint()
        useragent = ""
        browser_args = [
            "--app=http://localhost:5173/",
            "--disable-blink-features=AutomationControlled",
            "--test-type",
            "--disable-non-proxied-udp",
            "--disable-features=ImprovedCookieControls",
            "--lang=zh-CN",
            "--accept-lang=zh-CN,zh;q=0.9",
            "--no-first-run",
            "--no-default-browser-check",
            "--disable-fre",
            "--window-position=0,0",
            "--kiosk",
            f"--window-size={w},{h}"
        ]

        fp_args = {
            'fingerprint': '--fingerprint',
            'platform': '--fingerprint-platform',
            'platformVersion': '--fingerprint-platform-version',
            'brand': '--fingerprint-brand',
            'brandVersion': '--fingerprint-brand-version',
            'hardwareConcurrency': '--fingerprint-hardware-concurrency',
            'gpu_vendor': '--fingerprint-gpu-vendor',
            'gpu_renderer': '--fingerprint-gpu-renderer',
            'timezone': '--timezone',
            'userAgent': ''
        }
        for key, arg in fp_args.items():
            if key == "userAgent":
                useragent = base_fp.get(key, "")
                continue
            if key in base_fp:
                browser_args.append(f"{arg}={base_fp[key]}")

        profile = {
            "args": browser_args,
            "user_agent": useragent
        }

        with open(self.PROFILE_PATH, "w", encoding="utf-8") as f:
            json.dump(profile, f, ensure_ascii=False, indent=2)  # type: ignore

        return profile

    async def create_chrome(self):
        if self.playwright is None:
            self.playwright = await async_playwright().start()

        profile = self.load_profile()

        context = await self.playwright.chromium.launch_persistent_context(
            user_data_dir=str(self.USER_DATA_DIR),
            executable_path=str(self.CHROME_PATH),
            headless=False,
            viewport=None,
            args=profile["args"],
            ignore_default_args=["--enable-automation"],
            user_agent=profile["user_agent"]
        )
        page = context.pages[0] if context.pages else await context.new_page()
        return context, page, context.browser


async def worker_task():
    """每个任务独立运行一个浏览器实例"""
    chrome = Chrome("ayaka")
    context, page, browser = await chrome.create_chrome()
    # ⭐ 关键：打开UI页面（本地文件）

    while True:
        await asyncio.sleep(10)

if __name__ == "__main__":
    asyncio.run(worker_task())
