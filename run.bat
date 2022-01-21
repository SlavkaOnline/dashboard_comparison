docker run -it --name dashboard_comparison_test_runner -e HOST=%1 -e EMAIL=%2 -e PASSWORD=%3 dashboard_comparison
docker cp dashboard_comparison_test_runner:/app/allure-report ./
docker rm dashboard_comparison_test_runner
