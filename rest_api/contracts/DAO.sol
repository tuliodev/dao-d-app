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
        Rejected,
        Failed,
        ReadyForExecution,
        NotReachedVotes,
        Executed
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
        uint minimumVotes;
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
        string title,
        string description,
        uint256 minimumVotes,
        uint256 votingDuration
    );

    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);

    event Voted(uint256 indexed proposalId, address indexed Voter, VoteType support);

    function propose(
        address[] memory targets,
        uint[] memory values,
        bytes[] memory calldatas,
        string memory title,
        string memory description,
        uint256 minimumVotes,
        uint256 votingDuration
    ) external returns (uint256);

    function execute(
        uint256 proposalId,
        address[] memory targets,
        uint[] memory values,
        bytes[] memory calldatas,
        bytes32 titleHash,
        bytes32 descriptionHash,
        uint256 minimumVotes,
        uint256 votingDuration
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

    address ownerAdress_;

    mapping (uint256 => ProposalVote) public _proposalVotes;
    mapping (uint256 => ProposalCore) public _proposals;

    uint256 public numProposals;
    
    IERC20 public DaoToken;

    constructor(address _DaoToken) {
        DaoToken = IERC20(_DaoToken);
        ownerAdress_ = msg.sender;
    }

    function hashProposal(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash, bytes32 titleHash, uint256 minimumVotes, uint256 votingDuration) public pure returns(uint256) {
        return uint256(keccak256(abi.encode(targets, values, calldatas, descriptionHash, titleHash, minimumVotes, votingDuration)));
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

        if (proposal.voteEnd <= currentBlock && _proposalVotes[proposalId].againVotes + _proposalVotes[proposalId].againVotes < proposal.minimumVotes) {
            return State.NotReachedVotes;
        }

        if (currentBlock > proposal.voteEnd && _proposalVotes[proposalId].againVotes >  _proposalVotes[proposalId].forVotes) {
            return State.Rejected;
        }


        if (currentBlock > proposal.voteEnd && proposal.executed == false && proposal.cancelled == false && _proposalVotes[proposalId].againVotes <  _proposalVotes[proposalId].forVotes) {
            return State.ReadyForExecution;
        }
    }

    function hasVoted(uint256 proposalId, address voter) public view returns(bool) {
        return _proposalVotes[proposalId].voted[voter];
    }

    function propose(address[] memory targets, uint[] memory values, bytes[] memory calldatas, string memory title, string memory description, uint256 minimumVotes, uint256 votingDuration) external returns (uint256) {
        require(msg.sender == ownerAdress_, "Only Contract Owner can create a Proposal");
        require(DaoToken.balanceOf(msg.sender) > 0, "You need Dao Token to create a proposal");
        require(targets.length == values.length, "Governor: invalid proposal length");
        require(targets.length == calldatas.length, "Governor: invalid proposal length");
        require(targets.length > 0, "Governor: empty proposal");

        uint256 proposalId = hashProposal(targets, values, calldatas, keccak256(bytes(description)), keccak256(bytes(title)), minimumVotes, votingDuration);

        ProposalCore storage proposal = _proposals[proposalId];

        require(proposal.proposalState != State.Active, "Governal: Duplicate proposal");

        uint startBlock = block.number;
        uint endBlock = block.timestamp + (votingDuration * 1 minutes);

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
            title,
            description,
            minimumVotes,
            votingDuration
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

    function execute(uint256 proposalId, address[] memory targets, uint[] memory values, bytes[] memory calldatas, bytes32 titleHash, bytes32 descriptionHash, uint256 minimumVotes, uint256 votingDuration) public returns (bool execution) {
          require(msg.sender == ownerAdress_, "Only Contract Owner can execute a Proposal");
        uint256 GeneratedProposalId = hashProposal(targets, values, calldatas, descriptionHash, titleHash, minimumVotes, votingDuration);
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
                    _proposals[proposalId].proposalState = State.Executed;
                    return true;
                } else {
                    revert("Governor: call reverted without error message");
                }
            }
        }
    }

    }
