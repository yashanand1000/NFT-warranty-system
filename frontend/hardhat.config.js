require('@nomiclabs/hardhat-waffle');

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: '0.8.9',
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    polygon: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/3Dq4RKNRrelNTzpARgEpFbtsf6IlYFmP',
      accounts: [
        '014a4621c606b10c2213273bdd1316e39fca1de0a7813afb8ed78ee0b5929936',
      ],
    },
  },
};
