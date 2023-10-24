
# Space Game 👨‍🚀 

🚀🔥 You can play [here](http://spaceship.eu-4.evennode.com/auth)  

Space ship war game and space colonization. It is currently in the development phase.

## Setup ⚙️

1. Clone the repository:
   ```bash
   git clone https://github.com/RodnyE/space-game.git
   ```

2. Rename the `buildDependencies` property in `package.json` to `devDependencies`.

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm test
   ```

## Structure 📂

The project structure is as follows:

- `src/`: Contains the frontend React code.
- `serv/`: Contains the backend NodeJS code.
- `public/`: Contains the static files served by Express.
- `dist/`: Contains the bundled files generated by Webpack.

## Development 💠

To start the development server:

```bash
npm test
```

This command will run both the backend server and the frontend development build using Webpack. Any changes made in the code will automatically trigger a rebuild.

## Production 🚀

To build the project for production:

```bash
npm run build
```

This command will generate the optimized production build in the `dist/` directory.

To start the production server:

```bash
npm start
```

Make sure to set the appropriate environment variables in a `.env` file or in your hosting environment.

## Contributing 🤝

Feel free to contribute to this project by creating issues or submitting pull requests. Your contributions are highly appreciated.
