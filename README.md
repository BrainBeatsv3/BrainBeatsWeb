# BrainBeatsWeb
The repository that houses the entire Web Application for BrainBeats.

https://brainbeats.dev

# Build Instructions
To run the project locally:

- Clone this repository to your computer
- Navigate to the dev branch `git checkout dev`
- Navigate into the scripts sub-directory (from within the root directory) `cd scripts`
- Run `sudo ./startdev.sh`

# Notes

You will need a `.env` in your backend folder with the following information:

NEXT_JWT_KEY="whateveryouwantinhere"

DATABASE_URL="mysql://user:password@localhost:3306/BrainBeatsWeb"

You will also need MySQL up and running on your system. Substitute `user` and `password` in the `DATABASE_URL` with those credentials.

# Version Control Instructions
The `dev` branch is where all work is done, and once ready for the live website you must make a PR (Pull Request) to the main branch. The main branch is set up to directly work with the domain `brainbeats.dev` in a secure fashion.

# For more information
For future iterations of BrainBeats looking for more information and some guidance in jumping into development, please contact `Aestrus#9476` on Discord or receive Shyam Parikh's e-mail from Dr. Leinecker.

# Project Showcase Video
This was our showcase video we sent to the committee prior to our final presentation.

https://youtu.be/wvttb2_AZag
