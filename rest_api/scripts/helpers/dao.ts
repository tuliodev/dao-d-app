import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {

  ProposalCreated,

} from "../generated/Dao/Dao"
import { Proposal } from "../generated/schema"

export function handleProposalCreated(event: ProposalCreated): void {

  let entity = Proposal.load(event.params.proposalId.toString()+'-'+event.block.timestamp.toString()+'-'+event.transaction.from.toString());

  if (!entity) {
    entity = new Proposal(event.params.proposalId.toString()+'-'+event.block.timestamp.toString()+'-'+event.transaction.from.toString())  
    
  }
  
  entity.proposalId = event.params.proposalId
  entity.proposer = event.params.proposer
  entity.targetContracts = changetype<Bytes[]>(event.params.targetContracts)
  entity.proposer = event.params.proposer
  entity.values = event.params.values
  entity.calldatas = event.params.calldatas
  entity.startBlock = event.params.startBlock
  entity.endBlock = event.params.endBlock
  entity.description = event.params.description
  entity.title = event.params.title


  entity.save()
}

