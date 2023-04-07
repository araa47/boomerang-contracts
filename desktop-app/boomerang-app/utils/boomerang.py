from datetime import datetime, timedelta
from web3 import Web3


# ABI for Boomerang contract
abi = [{
    "inputs": [{
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
    }],
    "name": "getBoomerangInfo",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }, {
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}]

# Address of Boomerang contract
contract_address = "0x0509435e11861DFE5250261fc6633A5CD2cE9Cea"

# Node URL 
node_url = 'http://127.0.0.1:8545'

# Convert Unix timestamp to human-readable format
def to_human_readable_time(timestamp):
    return datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')

# Convert seconds to human-readable time
def to_human_readable_time_delta(seconds):
    delta = timedelta(seconds=seconds)
    years = delta.days // 365
    months = (delta.days % 365) // 30
    days = delta.days % 30
    hours = delta.seconds // 3600
    minutes = (delta.seconds % 3600) // 60
    seconds = delta.seconds % 60
    return f"{years} years, {months} months, {days} days, {hours} hours, {minutes} minutes, {seconds} seconds"



# Create a connection to the Ethereum network
web3 = Web3(Web3.HTTPProvider(node_url))

# Get contract instance
contract = web3.eth.contract(address=contract_address, abi=abi)



def get_boomerang_info(id):
    # Call getBoomerangInfo function
    result = contract.functions.getBoomerangInfo(id).call()
    if result[0] == 0: 
        return None

    cleaned = beautify_boomerang_info(result)

    return cleaned

def beautify_boomerang_info(result):
    # Print the result
    expiry_time = to_human_readable_time(result[0])
    update_frequency = to_human_readable_time_delta(result[1])
    last_check_in_time = to_human_readable_time(result[2])
    creator_address = result[3]
    print(f"Expiry time: {expiry_time}")
    print(f"Update frequency: {update_frequency}")
    print(f"Last check-in time: {last_check_in_time}")
    print(f"Creator address: {creator_address}")
    return {
        "expiry_time": expiry_time,
        "update_frequency": update_frequency, 
        "last_check_in_time": last_check_in_time, 
        "creator_address": creator_address
    }

# info = get_boomerang_info(1)
# beautify_boomerang_info(info)