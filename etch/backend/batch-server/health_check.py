import argparse, json, sys, requests, logging

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--url", default="http://localhost:8082/health",
                   help="헬스 체크 엔드포인트 URL")
    args = p.parse_args()

    try:
        resp = requests.get(args.url, timeout=5)
        if resp.status_code != 200:
            logging.error("HTTP %s returned %d", args.url, resp.status_code)
            sys.exit(1)

        data = resp.json()
        pretty = json.dumps(data, indent=2, ensure_ascii=False)
        logging.info("Response JSON:\n%s", pretty)

        if data.get("status") == "ok":
            sys.exit(0)
        else:
            logging.error("status 필드가 ok 아님 → %s", data.get("status"))
            sys.exit(1)

    except Exception as e:
        logging.error("요청 실패: %s", e)
        sys.exit(1)

if __name__ == "__main__":
    main()
