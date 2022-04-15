pragma solidity ^0.8.11;

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract UniswapAdapter {

    address public immutable ROUTER_ADDRESS;
    address public immutable FACTORY_ADDRESS;

    constructor(address _ROUTER_ADDRESS, address _FACTORY_ADDRESS) {
       ROUTER_ADDRESS = _ROUTER_ADDRESS;
       FACTORY_ADDRESS = _FACTORY_ADDRESS;
    }

    function createPair(address _tokenA, address _tokenB) public {
        IUniswapV2Factory(FACTORY_ADDRESS).createPair(_tokenA, _tokenB);
    }

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
        _getTokensForThisAddress(_tokenA, _amountADesired);
        _getTokensForThisAddress(_tokenB, _amountBDesired);

        (uint256 _amountA, uint256 _amountB, ) = 
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

        IERC20(_tokenA).transfer(
            msg.sender,
            _amountADesired - _amountA
        );
        IERC20(_tokenB).transfer(
            msg.sender,
            _amountBDesired - _amountB
        );
    }

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
        IERC20(pair).approve(ROUTER_ADDRESS, _liquidity);
        IERC20(pair).transferFrom(msg.sender, address(this), _liquidity);
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

    function getPrice(
        uint256 _amountOut, 
        address _tokenA, 
        address _tokenB
    ) public view returns (uint256 price) {
        address[] memory _path = new address[](2);
        _path[0] = _tokenA;
        _path[1] = _tokenB;

        uint256[] memory amounts = 
            IUniswapV2Router02(ROUTER_ADDRESS).getAmountsIn(_amountOut, _path);
        price = amounts[0];
    }

    function swap(
        uint256 _amountIn,
        uint256 _amountOutMin,
        address _tokenA, 
        address _tokenB,
        address _to,
        uint256 _deadline
    ) public {
        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountIn);
        IERC20(_tokenA).approve(ROUTER_ADDRESS, _amountIn);

        address[] memory _path = new address[](2);
        _path[0] = _tokenA;
        _path[1] = _tokenB;

        IUniswapV2Router02(ROUTER_ADDRESS).swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            _path,
            _to,
            _deadline
        );
    }

    function _getTokensForThisAddress(
        address _tokenAddress,
        uint256 _tokenAmount
    ) internal {
        IERC20(_tokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokenAmount
        );
        IERC20(_tokenAddress).approve(ROUTER_ADDRESS, _tokenAmount);
    }
}