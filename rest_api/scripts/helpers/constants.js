const DAO_ABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_DaoToken",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_votingDuration",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
      ],
      name: "ProposalCancelled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "proposer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address[]",
          name: "targetContracts",
          type: "address[]",
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "values",
          type: "uint256[]",
        },
        {
          indexed: false,
          internalType: "string[]",
          name: "targetsLength",
          type: "string[]",
        },
        {
          indexed: false,
          internalType: "bytes[]",
          name: "calldatas",
          type: "bytes[]",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "startBlock",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "endBlock",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "description",
          type: "string",
        },
      ],
      name: "ProposalCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
      ],
      name: "ProposalExecuted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "Voter",
          type: "address",
        },
        {
          indexed: false,
          internalType: "enum IDAO.VoteType",
          name: "support",
          type: "uint8",
        },
      ],
      name: "Voted",
      type: "event",
    },
    {
      inputs: [],
      name: "DaoToken",
      outputs: [
        {
          internalType: "contract IERC20",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "_proposalVotes",
      outputs: [
        {
          internalType: "uint256",
          name: "againVotes",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "forVotes",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "_proposals",
      outputs: [
        {
          internalType: "uint256",
          name: "voteStart",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "voteEnd",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "executed",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "cancelled",
          type: "bool",
        },
        {
          internalType: "enum IDAO.State",
          name: "proposalState",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          internalType: "address[]",
          name: "targets",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "values",
          type: "uint256[]",
        },
        {
          internalType: "bytes[]",
          name: "calldatas",
          type: "bytes[]",
        },
        {
          internalType: "bytes32",
          name: "descriptionHash",
          type: "bytes32",
        },
      ],
      name: "execute",
      outputs: [
        {
          internalType: "bool",
          name: "execution",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "voter",
          type: "address",
        },
      ],
      name: "hasVoted",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "targets",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "values",
          type: "uint256[]",
        },
        {
          internalType: "bytes[]",
          name: "calldatas",
          type: "bytes[]",
        },
        {
          internalType: "bytes32",
          name: "descriptionHash",
          type: "bytes32",
        },
      ],
      name: "hashProposal",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [],
      name: "numProposals",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "targets",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "values",
          type: "uint256[]",
        },
        {
          internalType: "bytes[]",
          name: "calldatas",
          type: "bytes[]",
        },
        {
          internalType: "string",
          name: "description",
          type: "string",
        },
      ],
      name: "propose",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
      ],
      name: "state",
      outputs: [
        {
          internalType: "enum IDAO.State",
          name: "proposalState",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "proposalId",
          type: "uint256",
        },
        {
          internalType: "uint8",
          name: "support",
          type: "uint8",
        },
      ],
      name: "vote",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "votingDuration",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

exports.DAO_ABI = DAO_ABI;