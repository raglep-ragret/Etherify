// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

/**
 * @title Etherify
 * @author ~raglep-ragret (raglep-ragret@protonmail.com)
 * @notice A distributed Spotify playlist on the Ethereum blockchain.
 *         Built as part of the buildspace.so Solidity course.
 */
contract EtherifyPlaylist {
    /**
     * @notice Event emitted when a track is added ot the playlist
     */
    event TrackAdded(
        address indexed addr,
        uint256 id,
        string spotifyUri,
        uint256 timestamp
    );

    /**
     * @notice Event emitted when an address likes a track
     */
    event LikedTrack(address indexed addr, uint256 id, uint256 timestamp);

    /**
     * @notice Event emitted when an address unlikes a track
     */
    event UnlikedTrack(address indexed addr, uint256 id, uint256 timestamp);

    /**
     * @notice Struct to hold our tracks' info.
     */
    struct EtherifyTrack {
        // Address that added this track to the playlist.
        address addr;
        // Unique identifier for this track.
        uint256 id;
        // Spotify link, stored as a simple `string`.
        string spotifyLink;
        // Time at which this track was added.
        uint256 timestamp;
    }

    // PRNG seed
    uint256 private seed;

    // The full Etherify playlist.
    EtherifyTrack[] playlist;

    // Mapping from address to tracks submitted by that address.
    mapping(address => EtherifyTrack[]) tracksByAddress;

    // Number of likes each track has.
    mapping(uint256 => uint256) likes;

    // Mapping to check whether a particular address has liked a particular track.
    mapping(address => mapping(uint256 => bool)) likesForAddress;

    // Stores the last time an address added a track.
    mapping(address => uint256) lastAddedTrack;

    // Stores whether a spotify URI has already been added.
    mapping(string => bool) spotifyUriAlreadyAdded;

    constructor() payable {
        console.log("Etherify playlist initialized");

        // Set initial PRNG seed
        seed = (block.timestamp + block.difficulty) % 100;
    }

    /**
     * @notice Adds a track to the Etherify playlist
     * @param _spotifyUri Spotify URI of the track to add
     */
    function addTrack(string memory _spotifyUri) public {
        require(
            lastAddedTrack[msg.sender] + 10 minutes < block.timestamp,
            "Must wait 10 minutes between adding another tracks"
        );

        require(
            !spotifyUriAlreadyAdded[_spotifyUri],
            "Can't add duplicate tracks"
        );

        // Update timestamp for most recent track added
        lastAddedTrack[msg.sender] = block.timestamp;

        spotifyUriAlreadyAdded[_spotifyUri] = true;

        // Generate new PRNG seed for next transaction
        seed = (block.difficulty + block.timestamp + seed) % 100;

        uint256 _id = playlist.length;

        EtherifyTrack memory _newTrack = EtherifyTrack(
            msg.sender,
            _id,
            _spotifyUri,
            block.timestamp
        );

        playlist.push(_newTrack);
        tracksByAddress[msg.sender].push(_newTrack);

        uint256 prizeAmount = 0.0001 ether;

        if (seed <= 10 && prizeAmount <= address(this).balance) {
            console.log("%s won some ether!", msg.sender);

            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit TrackAdded(msg.sender, _id, _spotifyUri, block.timestamp);
    }

    /**
     * @notice Gets the total number of tracks on the Etherify playlist.
     * @return uint256 number of tracks on the playlist
     */
    function getTotalTracks() public view returns (uint256) {
        console.log(
            "There are %d total tracks in the playlist \n",
            playlist.length
        );

        return playlist.length;
    }

    /**
     * @notice Gets the full Etherify playlist.
     * @return EtherifyTrack[] the Etherify playlist
     */
    function getPlaylist() public view returns (EtherifyTrack[] memory) {
        console.log("Getting the current playlist.");

        return playlist;
    }

    /**
     * @notice Gets the tracks submitted by the sender.
     *      Does this by calling `getTracksByAddress`.
     * @return EtherifyTrack[] array of tracks submitted by sender
     */
    function getMyTracks() public view returns (EtherifyTrack[] memory) {
        return getTracksByAddress(msg.sender);
    }

    /**
     * @notice Gets the tracks submitted by a particular address.
     * @param _addr address to check
     * @return EtherifyTrack[] array of tracks submitted by address
     */
    function getTracksByAddress(address _addr)
        public
        view
        returns (EtherifyTrack[] memory)
    {
        console.log("Getting tracks submitted by address %s.", _addr);

        return tracksByAddress[_addr];
    }

    /**
     * @notice Gets the number of likes for a particular track.
     * @param _trackId track ID to check
     * @return uint256 number of likes
     */
    function getLikesForTrack(uint256 _trackId) public view returns (uint256) {
        console.log("Getting likes for track %d.", _trackId);

        return likes[_trackId];
    }

    /**
     * @notice Checks whether the sender likes a particular track.
     *         Does this by calling `doesUserLiketrack`.
     * @param _trackId track ID to check
     * @return boolean whether sender likes track
     */
    function doILikeTrack(uint256 _trackId) public view returns (bool) {
        return doesUserLikeTrack(msg.sender, _trackId);
    }

    /**
     * @notice Checks whether a particular address likes a particular track.
     * @param _addr address to check
     * @param _trackId track ID to check
     * @return boolean whether address likes track
     */
    function doesUserLikeTrack(address _addr, uint256 _trackId)
        public
        view
        returns (bool)
    {
        console.log(
            "Checking whether user %s likes track %d.",
            _addr,
            _trackId
        );

        return likesForAddress[_addr][_trackId];
    }

    /**
     * @notice Likes a track for the sender. You can't like a track
     *         more than once, so this will only succeed if the sender
     *         has not already liked it.
     * @param _trackId track ID to like
     */
    function likeTrack(uint256 _trackId) public {
        require(
            !likesForAddress[msg.sender][_trackId],
            "Can't like a track you've already liked!"
        );

        likes[_trackId] += 1;
        likesForAddress[msg.sender][_trackId] = true;

        emit LikedTrack(msg.sender, _trackId, block.timestamp);
    }

    /**
     * @notice Unlikes a track for the sender. You can't unlike a track
     *         that you don't like, so this will only succeed if the sender
     *         has already liked it.
     * @param _trackId track ID to unlike
     */
    function unlikeTrack(uint256 _trackId) public {
        require(
            likesForAddress[msg.sender][_trackId],
            "Can't unlike a track you haven't liked!"
        );

        likes[_trackId] -= 1;
        likesForAddress[msg.sender][_trackId] = false;

        emit UnlikedTrack(msg.sender, _trackId, block.timestamp);
    }
}
