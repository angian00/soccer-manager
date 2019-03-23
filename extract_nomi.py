#!/usr/bin/env python3

namefile = "resources/nomi_italiani.csv"

def main():
	#read female names first
	female_names = set()
	with open(namefile) as f:
		first_line = True
		for line in f:
			if first_line:
				#skip header
				first_line = False
				continue

			tokens = line.split(",")
			name = tokens[0]
			gender = tokens[4]

			if gender == "f":
				female_names.add(name)


	#print(sorted(list(female_names))[:200])
	print("# {} female names found".format(len(female_names)))

	male_names = {}
	with open(namefile) as f:
		first_line = True
		for line in f:
			if first_line:
				#skip header
				first_line = False
				continue

			tokens = line.split(",")
			name = tokens[0]
			year = tokens[2]
			count = int(tokens[3])
			gender = tokens[4]

			if gender == "m" and name not in female_names:
				if name in male_names:
					male_names[name] = male_names[name] + count
				else:
					male_names[name] = count

	for name in male_names:
		print("{}|{}".format(name.title(), male_names[name]))

if __name__ == '__main__':
	main()
