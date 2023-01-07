export function read_fs(path) {
	if (is_file(path)) {
		const url = new URL(path, import.meta.main);
		return Deno.readTextFileSync(url)
	} else {
		return null
	}
}

export function is_file(path) {
	try {
		const url = new URL(path, import.meta.main);
		const file = Deno.statSync(url)
		return file.is_file
	} catch {
		return false
	}
}

export function is_dir(path) {
	try {
		const url = new URL(path, import.meta.main);
		const file = Deno.statSync(url)
		return file.is_dir
	} catch {
		return false
	}
}