import Swal from "sweetalert2";
import getCssVariable from "../getCssVariable";

const swalBasic = Swal.mixin({
	background: getCssVariable("--card-gray"),
	color: "white",
});

const swalConfirmCancel = swalBasic.mixin({
	customClass: {
		confirmButton: "button",
		cancelButton: "button delete-button",
	},
});

export { swalBasic, swalConfirmCancel };
