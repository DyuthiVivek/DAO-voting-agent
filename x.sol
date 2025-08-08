// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract HederaDAO {
    struct Proposal {
        address proposer;
        string description;
        uint256 deadline;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;

    mapping(address => uint256) public votingPower;
    address public treasury;
    address public owner;

    event NewProposal(uint256 indexed proposalId, address proposer, string description, uint256 deadline);
    event Voted(uint256 indexed proposalId, address voter, bool support, uint256 weight);
    event Executed(uint256 indexed proposalId, bool passed);
    event VotingPowerUpdated(address voter, uint256 newPower);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Manually set voting power for an address
    function setVotingPower(address voter, uint256 power) public onlyOwner {
        votingPower[voter] = power;
        emit VotingPowerUpdated(voter, power);
    }

    function createProposal(string calldata description, uint256 votingPeriod) external {
        require(votingPower[msg.sender] > 0, "No voting power");
        proposalCount++;
        proposals[proposalCount] = Proposal(
            msg.sender,
            description,
            block.timestamp + votingPeriod,
            0,
            0,
            false
        );
        emit NewProposal(proposalCount, msg.sender, description, block.timestamp + votingPeriod);
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.deadline, "Voting period over");
        uint256 weight = votingPower[msg.sender];
        require(weight > 0, "No voting power");
        if (support) {
            proposal.votesFor += weight;
        } else {
            proposal.votesAgainst += weight;
        }
        emit Voted(proposalId, msg.sender, support, weight);
    }

    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.deadline, "Voting period not over");
        require(!proposal.executed, "Already executed");
        proposal.executed = true;
        bool passed = proposal.votesFor > proposal.votesAgainst;
        // Treasury logic can be added here
        emit Executed(proposalId, passed);
    }
}

