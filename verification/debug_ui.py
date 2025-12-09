from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"Console: {msg.text}"))

        try:
            print("Navigating to app...")
            page.goto("http://localhost:3000")

            print("Waiting for load...")
            # Wait a bit longer or wait for a specific element
            page.wait_for_timeout(5000)

            # Take screenshot
            page.screenshot(path="verification/debug_screenshot.png")
            print("Screenshot taken")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_app()
