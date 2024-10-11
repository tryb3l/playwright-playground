
# Script to start the app
start_app() {
  echo "Running the app..."
  cd app && npm start
}

# Script to stop the app
stop_app() {
  echo "Stopping the app..."
  cd app && npm run stop
}

# Call the appropriate function based on the argument
case "$1" in
  (start_app)
    start_app
    ;;
  (stop_app)
    stop_app
    ;;
  (*)
    echo "Usage: $0 {start_app|stop_app}"
    exit 1
    ;;
esac