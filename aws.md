# Step for hosting on EC2

## Install btop, a better top

```sh
curl -SL --fail https://github.com/aristocratos/btop/releases/download/v1.4.6/btop-x86_64-unknown-linux-musl.tbz \
 -o btop.tbz
tar -xvf btop.tbz
rm btop.tbz
mkdir bin
ln -s ~/btop/bin/btop bin/btop
```

## Enable swap (slow is better than dead)

```sh
sudo /bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=1024
sudo chmod 600 /var/swap.1
sudo /sbin/mkswap /var/swap.1
sudo /sbin/swapon /var/swap.1
```

Add to /etc/fstab

```
/var/swap.1 swap swap defaults 0 0
```

## Install docker & docker compose

```sh
sudo dnf install docker
sudo systemctl enable --now docker
sudo usermod -aG docker $USER

mkdir -p ~/.docker/cli-plugins
curl -SL --fail https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose

curl -SL --fail https://github.com/docker/buildx/releases/download/v0.31.1/buildx-v0.31.1.linux-amd64 \
  -o ~/.docker/cli-plugins/docker-buildx
chmod +x ~/.docker/cli-plugins/docker-buildx
```

## Running

```sh
docker compose up
```
