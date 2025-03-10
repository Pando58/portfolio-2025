{
	inputs = {
		nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
	};

	outputs = {
		nixpkgs,
		...
	}: let
		system = "x86_64-linux";
		pkgs = import nixpkgs {
			inherit system;
			overlays = [];
		};
	in {
		devShells.${system}.default = (import ./shell.nix { inherit pkgs; });
	};
}
