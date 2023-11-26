// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


interface IDAO {
    enum VoteType {
        Against,
        For
    }

    enum State {
        NotFound,
        Active,
        Success,
        Failed,
        ReadyForExecution
    }

    struct ProposalVote {
        uint256 againVotes;
        uint256 forVotes;
        mapping(address => bool) voted;
    }

    struct ProposalCore {
        uint voteStart;
        uint voteEnd;
        bool executed;
        bool cancelled;
        State proposalState;
    }

    event ProposalCreated (
        uint256 indexed proposalId,
        address proposer,
        address[] targetContracts,
        uint[] values,
        string[] targetsLength,
        bytes[] calldatas,
        uint startBlock,
        uint endBlock,
        string description
    );

    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);

    event Voted(uint256 indexed proposalId, address indexed Voter, VoteType support);

    function propose(
        address[] memory targets,
        uint[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256);

    function execute(
        uint256 proposalId,
        address[] memory targets,
        uint[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) external returns (bool);

    function vote(uint256 proposalId, uint8 support) external;

    function hasVoted(uint proposalId, address voter) external view returns (bool);

    function state(uint proposalId) external view returns (State);

}

interface INFTCollection {
     function balanceOf(address _owner) external view returns(uint);
}

interface IERC20 {
    function balanceOf(address _owner) external view returns(uint);
}

contract DAO is IDAO {

    mapping (uint256 => ProposalVote) public _proposalVotes;
    mapping (uint256 => ProposalCore) public _proposals;

    uint256 public numProposals;
    uint256 public votingDuration;

    IERC20 public DaoToken;

    constructor(address _DaoToken, uint256 _votingDuration) {
        DaoToken = IERC20(_DaoToken);
        votingDuration = _votingDuration;
    }

    function hashProposal(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash) public pure returns(uint256) {
        return uint256(keccak256(abi.encode(targets, values, calldatas, descriptionHash)));
    }

    function state(uint proposalId) public view returns (State proposalState) {
        uint currentBlock = block.number;
        ProposalCore storage proposal = _proposals[proposalId];

        if (proposal.proposalState == State.NotFound) {
            return State.NotFound;
        }

        if (currentBlock < proposal.voteEnd && proposal.proposalState == State.Active) {
            return State.Active;            
        }

        if (proposal.voteEnd <= currentBlock && proposal.cancelled == true) {
            return State.Failed;
        }

        if (currentBlock > proposal.voteEnd && proposal.executed == false && proposal.cancelled == false) {
            return State.ReadyForExecution;
        }
    }

    function hasVoted(uint256 proposalId, address voter) public view returns(bool) {
        return _proposalVotes[proposalId].voted[voter];
    }

    function propose(address[] memory targets, uint[] memory values, bytes[] memory calldatas, string memory description) external returns (uint256) {
        require(DaoToken.balanceOf(msg.sender) < 0, "You need Dao Token to create a proposal");
        require(targets.length == values.length, "Governor: invalid proposal length");
        require(targets.length == calldatas.length, "Governor: invalid proposal length");
        require(targets.length > 0, "Governor: empty proposal");

        uint256 proposalId = hashProposal(targets, values, calldatas, keccak256(bytes(description)));

        ProposalCore storage proposal = _proposals[proposalId];

        require(proposal.proposalState != State.Active, "Governal: Duplicate proposal");

        uint startBlock = block.number;
        uint endBlock = block.number + votingDuration;

        proposal.voteStart = startBlock;
        proposal.voteEnd = endBlock;
        proposal.proposalState = State.Active;

        numProposals += 1;

        emit ProposalCreated(
            proposalId,
            msg.sender,
            targets,
            values,
            new string[](targets.length),
            calldatas,
            startBlock,
            endBlock,
            description
        );

        return proposalId;
    }

    function vote(uint256 proposalId, uint8 support) external {
        require(DaoToken.balanceOf(msg.sender) > 0, "Governor: You need Dao token to vote");
        require(hasVoted(proposalId, msg.sender) == false, 'Governor: Already voted');
        require(state(proposalId) == State.Active, "Governor: Proposal is not active");

        _proposalVotes[proposalId].voted[msg.sender] = true;

        if (support == 0) {
            _proposalVotes[proposalId].againVotes += 1;
        }

        if (support == 1) {
            _proposalVotes[proposalId].forVotes += 1;
        }

        emit Voted(proposalId, msg.sender, VoteType(support));
    }

    function execute(uint256 proposalId, address[] memory targets, uint[] memory values, bytes[] memory calldatas, bytes32 descriptionHash) public returns (bool execution) {
        uint256 GeneratedProposalId = hashProposal(targets, values, calldatas, descriptionHash);
        require(proposalId == GeneratedProposalId, "governor: proposal ID doesn't match");
        require(state(proposalId) == State.ReadyForExecution, "Governor: proposal must be ready for execution");

        ProposalVote storage votes = _proposalVotes[proposalId];

        if (votes.forVotes < votes.againVotes || (votes.forVotes == 0 && votes.againVotes == 0)) {
            _proposals[proposalId].cancelled = true;
            emit ProposalCancelled(proposalId);
            return true;
        } else {
            _proposals[proposalId].executed = true;

            emit ProposalExecuted(proposalId);

            for (uint256 i = 0; i < targets.length; ++i) {
                (bool success, ) = targets[i].call{value: values[i]}(calldatas[i]);

                if (success) {
                    return true;
                } else {
                    revert("Governor: call reverted without error message");
                }
            }
        }
    }

    }
