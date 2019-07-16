

# Install application specific Ruby dependencies
docker-compose run web bundle install
# Install application specific Javascript deps
docker-compose run web npm install
# Create a database in PostgreSQL
docker-compose run web bundle exec rails db:create db:migrate
# Generate a set of *.pem files for data encryption
docker-compose run web rake keys:generate # ⚠ SKIP THIS STEP IF UPGRADING!
# Build the UI assets via ParcelJS
docker-compose run web rake assets:precompile
# Run the server! ٩(^‿^)۶
# NOTE: DONT TRY TO LOGIN until you see a message similar to this:
#   "✨  Built in 44.92s"
# THIS MAY TAKE A VERY LONG TIME ON SLOW MACHINES (~3 minutes on DigitalOcean)
# You will just get an empty screen otherwise.
# This only happens during initialization
docker-compose up
