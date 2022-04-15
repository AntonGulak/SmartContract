pragma solidity ^0.8.11;

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract UniswapAdaptor {
    using SafeERC20 for IERC20;
    address public constant ROUTER_ADDRESS =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address public constant FACTORY_ADDRESS =
        0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    function createPair(address _token0, address _token1) public {
        IUniswapV2Factory(FACTORY_ADDRESS).createPair(_token0, _token1);
    }

    /// @notice Transfers tokens to adaptor contract and approves tokens for ROUTER_ADDRESS to add liquidity
    /// @param _tokenAddress One of the two tokens in pair
    /// @param _tokenAmount Amount of tokens wich will be deposited ot pair
    function _prepareForAddLiquidity(
        address _tokenAddress,
        uint256 _tokenAmount
    ) private {
        IERC20(_tokenAddress).safeTransferFrom(
            msg.sender,
            address(this),
            _tokenAmount
        );

        IERC20(_tokenAddress).approve(ROUTER_ADDRESS, _tokenAmount);
    }

    /// @notice Adds liquidity to the pool
    /// @dev We need to prepare tokens to add liquidity {See _prepareForAddLiquidity}
    /// @param _tokenA A pool token.
    /// @param _tokenB B pool token.
    /// @param _amountADesired The amount of tokenA to add as liquidity if the B/A price is <= amountBDesired/amountADesired (A depreciates).
    /// @param _amountBDesired The amount of tokenA to add as liquidity if the A/B price is <= amountADesired/amountBDesired (B depreciates).
    /// @param _amountAMin Bounds the extent to which the B/A price can go up before the transaction reverts. Must be <= amountADesired
    /// @param _amountBMin Bounds the extent to which the A/B price can go up before the transaction reverts. Must be <= amountBDesired
    /// @param _to Recipient of the liquidity tokens.
    /// @param _deadline Unix timestamp after which the transaction will revert.
    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _amountADesired,
        uint256 _amountBDesired,
        uint256 _amountAMin,
        uint256 _amountBMin,
        address _to,
        uint256 _deadline
    ) public {
        _prepareForAddLiquidity(_tokenA, _amountADesired);
        _prepareForAddLiquidity(_tokenB, _amountBDesired);

        IUniswapV2Router02(ROUTER_ADDRESS).addLiquidity(
            _tokenA,
            _tokenB,
            _amountADesired,
            _amountBDesired,
            _amountAMin,
            _amountBMin,
            _to,
            _deadline
        );

        IERC20(_tokenA).safeTransfer(
            msg.sender,
            IERC20(_tokenA).balanceOf(address(this))
        );
        IERC20(_tokenB).safeTransfer(
            msg.sender,
            IERC20(_tokenB).balanceOf(address(this))
        );
    }

    /// @notice Removes liquidity from the pool
    /// @dev User send lp-tokens to the adaptor. Adaptor is needed to approve the UniswapV2Router02 to spend lp-tokens
    /// @param _tokenA A pool token.
    /// @param _tokenB A pool token.
    /// @param _liquidity The amount of liquidity tokens to remove.
    /// @param _amountAMin 	The minimum amount of tokenA that must be received for the transaction not to revert.
    /// @param _amountBMin The minimum amount of tokenB that must be received for the transaction not to revert.
    /// @param _to Recipient of the underlying assets.
    /// @param _deadline Unix timestamp after which the transaction will revert.
    function removeLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _liquidity,
        uint256 _amountAMin,
        uint256 _amountBMin,
        address _to,
        uint256 _deadline
    ) public {
        address pair = IUniswapV2Factory(FACTORY_ADDRESS).getPair(
            _tokenA,
            _tokenB
        );
        require(pair != address(0), "Adaptor: nonexistent pair");
        IERC20(pair).approve(ROUTER_ADDRESS, _liquidity);
        IERC20(pair).safeTransferFrom(msg.sender, address(this), _liquidity);
        IUniswapV2Router02(ROUTER_ADDRESS).removeLiquidity(
            _tokenA,
            _tokenB,
            _liquidity,
            _amountAMin,
            _amountBMin,
            _to,
            _deadline
        );
    }

    /// @notice Gives price for `_amountOut` tokens
    /// @param _amountOut Amount of tokens in pair what you want to give
    /// @param _path Array of token addresses
    /// @return price Price for `_amountOut` tokens
    function getPriceFor(uint256 _amountOut, address[] memory _path)
        public
        view
        returns (uint256 price)
    {
        uint256[] memory amounts = IUniswapV2Router02(ROUTER_ADDRESS)
            .getAmountsIn(_amountOut, _path);
        price = amounts[0];
    }

    /// @notice Swaps one tokens for other
    /// @dev We need to approve the adaptor and router to trasfer tokens with path[0] address to adaptor and from adaptor to pair.
    /// @param _amountIn The amount of input tokens to send.
    /// @param _amountOutMin The minimum amount of output tokens that must be received for the transaction not to revert.
    /// @param _path An array of token addresses. path.length must be >= 2. Pools for each consecutive pair of addresses must exist and have liquidity.
    /// @param _to Recipient of the output tokens.
    /// @param _deadline Unix timestamp after which the transaction will revert.
    function swap(
        uint256 _amountIn,
        uint256 _amountOutMin,
        address[] calldata _path,
        address _to,
        uint256 _deadline
    ) public {
        IERC20(_path[0]).safeTransferFrom(msg.sender, address(this), _amountIn);
        IERC20(_path[0]).approve(ROUTER_ADDRESS, _amountIn);
        IUniswapV2Router02(ROUTER_ADDRESS).swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            _path,
            _to,
            _deadline
        );
    }
}