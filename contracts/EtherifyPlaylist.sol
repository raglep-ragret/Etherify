// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract EtherifyPlaylist {
    // Struct to hold our tracks' info.
    struct EtherifyTrack {
        address addr;
        string spotifyLink;
    }

    // The full Etherify playlist.
    EtherifyTrack[] playlist;

    // Mapping from address to tracks submitted by that address.
    mapping(address => EtherifyTrack[]) public tracksByAddress;

    constructor() {
        console.log("Etherify playlist initialized");
    }

    function addTrack(string memory trackToAdd) public {
        EtherifyTrack memory newTrack = EtherifyTrack(msg.sender, trackToAdd);

        playlist.push(newTrack);
        tracksByAddress[msg.sender].push(newTrack);

        console.log(
            "%s added a track:\n%s\n",
            newTrack.addr,
            newTrack.spotifyLink
        );
    }

    function getTotalTracks() public view returns (uint256) {
        console.log(
            "There are %d total tracks in the playlist \n",
            playlist.length
        );

        return playlist.length;
    }

    function getPlaylist() public view returns (EtherifyTrack[] memory) {
        console.log("Here's the current playlist:");

        return playlist;
    }

    function getTracksByAddress(address addr)
        public
        view
        returns (EtherifyTrack[] memory)
    {
        console.log("Getting tracks submitted by address %s:", addr);

        return tracksByAddress[addr];
    }
}
