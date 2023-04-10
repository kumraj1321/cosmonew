const RES_VER = "1";
const CREATE_SLUG = (name: string) => {
	return name.toString().trim().toLowerCase().replace(/[^a-z0-9 ]+/g, "").replace(/[^a-z0-9]+/g, "-")
};
export { CREATE_SLUG, RES_VER }